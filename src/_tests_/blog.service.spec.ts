import blogService from '../services/blog.service';
import { getAppDataSource } from '../data-source';
import { Blog } from '../entity/blog.entity';
import { Tag } from '../entity/tag.entity';

jest.mock('../data-source', () => ({
  getAppDataSource: jest.fn(),
}));

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('blogService', () => {
  let blogRepoMock: any;
  let tagRepoMock: any;

  beforeEach(() => {
    blogRepoMock = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    tagRepoMock = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    (getAppDataSource as jest.Mock).mockReturnValue({
      getRepository: (entity: any) => {
        if (entity === Blog) return blogRepoMock;
        if (entity === Tag) return tagRepoMock;
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a blog and return it', async () => {
      const res = mockRes();
      const tags = [{ name: 'Tech' }];
      tagRepoMock.findOne.mockResolvedValue(null);
      tagRepoMock.create.mockReturnValue(tags[0]);
      tagRepoMock.save.mockResolvedValue(tags[0]);

      const newBlog = { title: 'Test', content: 'Content', tags };
      blogRepoMock.create.mockReturnValue(newBlog);
      blogRepoMock.save.mockResolvedValue(newBlog);

      await blogService.create(res, {
        title: 'Test',
        content: 'Content',
        tags: ['Tech'],
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newBlog);
    });
  });

  describe('getAll', () => {
    it('should return paginated blogs', async () => {
      const res = mockRes();
      const query = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        addGroupBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[{ title: 'Blog1' }], 1]),
      };
      blogRepoMock.createQueryBuilder.mockReturnValue(query);

      await blogService.getAll(res, 1, 10, ['Tech']);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: [{ title: 'Blog1' }],
        total: 1,
        page: 1,
        totalPages: 1,
      });
    });
  });

  describe('update', () => {
    it('should update and return the blog', async () => {
      const res = mockRes();
      const blog = { id: 1, title: 'Old', content: 'Old', tags: [] };
      const newTag = { name: 'Updated' };

      blogRepoMock.findOne.mockResolvedValue(blog);
      tagRepoMock.findOne.mockResolvedValue(null);
      tagRepoMock.create.mockReturnValue(newTag);
      tagRepoMock.save.mockResolvedValue(newTag);
      blogRepoMock.save.mockResolvedValue({ ...blog, title: 'New', tags: [newTag] });

      await blogService.update(res, 1, {
        title: 'New',
        tags: ['Updated'],
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ ...blog, title: 'New', tags: [newTag] });
    });

    it('should return 404 if blog not found', async () => {
      const res = mockRes();
      blogRepoMock.findOne.mockResolvedValue(null);

      await blogService.update(res, 1, { title: 'Nothing' });

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Blog not found' });
    });
  });

  describe('delete', () => {
    it('should delete blog and return success message', async () => {
      const res = mockRes();
      const blog = { id: 1, title: 'ToDelete' };

      blogRepoMock.findOne.mockResolvedValue(blog);
      blogRepoMock.remove.mockResolvedValue(blog);

      await blogService.delete(res, 1);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Blog deleted successfully' });
    });

    it('should return 404 if blog not found', async () => {
      const res = mockRes();
      blogRepoMock.findOne.mockResolvedValue(null);

      await blogService.delete(res, 999);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Blog not found' });
    });
  });
});
