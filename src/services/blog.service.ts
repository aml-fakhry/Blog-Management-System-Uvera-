import { Response } from 'express';
import { getAppDataSource } from '../data-source';
import { Blog } from '../entity/blog.entity';
import { In } from 'typeorm';
import { Tag } from '../entity/tag.entity';

/**
 * Blog service for handling blog operations.
 */
class blogService {
  /** Create a new blog post. */
  async create(res: Response, data: { title: string; content: string; tags: string[] }) {
    try {
      const blogRepo = getAppDataSource().getRepository(Blog);
      const tagRepo = getAppDataSource().getRepository(Tag);

      const tags = await Promise.all(
        data.tags.map(async (name) => {
          let tag = await tagRepo.findOne({ where: { name } });
          if (!tag) {
            tag = tagRepo.create({ name });
            await tagRepo.save(tag);
          }
          return tag;
        })
      );
      const newBlog = blogRepo.create({
        title: data.title,
        content: data.content,
        tags: tags,
      });

      const savedBlog = await blogRepo.save(newBlog);
      return res.status(201).json(savedBlog);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to create blog' });
    }
  }

  /** Get all blog posts with pagination and filtering by tags. */
  async getAll(res: Response, page: number = 1, limit: number = 10, tags: string[] = []) {
    try {
      const blogRepo = getAppDataSource().getRepository(Blog);

      const skip = (page - 1) * limit;

      let query = blogRepo.createQueryBuilder('blog').leftJoinAndSelect('blog.tags', 'tag');

      if (tags.length > 0) {
        query = query.where('tag.name IN (:...tags)', { tags }).groupBy('blog.id').addGroupBy('tag.id');
      }

      const [blogs, total] = await query.skip(skip).take(limit).getManyAndCount();

      return res.status(200).json({
        data: blogs,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to retrieve blogs' });
    }
  }

  /** Update a blog post by ID. */
  async update(res: Response, id: number, data: any) {
    try {
      const blogRepo = getAppDataSource().getRepository(Blog);
      const tagRepo = getAppDataSource().getRepository(Tag);

      const blog = await blogRepo.findOne({ where: { id }, relations: ['tags'] });
      if (!blog) return res.status(404).json({ message: 'Blog not found' });

      if (data.title) blog.title = data.title;
      if (data.content) blog.content = data.content;

      if (data.tags) {
        const tags = await Promise.all(
          data.tags.map(async (name: any) => {
            let tag = await tagRepo.findOne({ where: { name } });
            if (!tag) {
              tag = tagRepo.create({ name });
              await tagRepo.save(tag);
            }
            return tag;
          })
        );
        blog.tags = tags;
      }

      const updatedBlog = await blogRepo.save(blog);
      return res.status(200).json(updatedBlog);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to update blog' });
    }
  }

  /** Delete a blog post by ID. */
  async delete(res: Response, id: number) {
    try {
      const blogRepo = getAppDataSource().getRepository(Blog);
      const blog = await blogRepo.findOne({ where: { id } });
      if (!blog) return res.status(404).json({ message: 'Blog not found' });

      await blogRepo.remove(blog);
      return res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to delete blog' });
    }
  }
}

export default new blogService();
