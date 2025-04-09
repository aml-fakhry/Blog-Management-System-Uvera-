import { Response } from 'express';
import { AppDataSource } from '../data-source';
import { Blog } from '../entity/blog';
import { In } from 'typeorm';

/**
 * Blog service for handling blog operations.
 */
class blogService {
  /** Create a new blog post. */
  async create(res: Response, data: { title: string; content: string; tags: string[] }) {
    try {
      const blogRepo = AppDataSource.getRepository(Blog);

      const newBlog = blogRepo.create({
        title: data.title,
        content: data.content,
        tags: data.tags,
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
      const blogRepo = AppDataSource.getRepository(Blog);

      // Set pagination
      const skip = (page - 1) * limit;
      const take = limit;

      // Build the query for filtering by tags if provided
      const where = tags.length > 0 ? { tags: In(tags) } : {};

      // Retrieve blogs with pagination and filtering
      const [blogs, total] = await blogRepo.findAndCount({
        where,
        skip,
        take,
      });

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
      const blogRepo = AppDataSource.getRepository(Blog);

      const blog = await blogRepo.findOneBy({ id });
      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
      }

      blogRepo.merge(blog, data);
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
      const blogRepo = AppDataSource.getRepository(Blog);

      const result = await blogRepo.delete(id);

      if (result.affected === 0) {
        return res.status(404).json({ message: 'Blog not found' });
      }

      return res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to delete blog' });
    }
  }
}

export default new blogService();
