import { Router } from 'express';
import blogService from '../services/blog.service';
import { Authenticate, Authorize, Roles } from '../shared/middleware/auth.middleware';

/**
 * The blog router that holds all blog-related routes.
 */
export const blogRouter = Router();

/**
 * The relative route for blogs.
 */
export const blogRelativeRoute = 'blogs';

/** Create a new blog */
blogRouter.post('/', Authenticate, Authorize(Roles.ADMIN, Roles.EDITOR), async (req, res) => {
  await blogService.create(res, req.body);
});

/** Get all blogs with pagination and filtering by tags */
blogRouter.get('/', Authenticate, async (req, res) => {
  const { page = 1, limit = 10, tags = '' } = req.query;

  // Parse the tags query into an array
  const tagsArray = tags ? (tags as string).split(',') : [];

  await blogService.getAll(res, parseInt(page as string), parseInt(limit as string), tagsArray);
});

/** Update a blog by ID */
blogRouter.put('/:id', Authenticate, Authorize(Roles.ADMIN, Roles.EDITOR), async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ message: 'Invalid blog ID' });
    return;
  }

  await blogService.update(res, id, req.body);
});

/** Delete a blog by ID */
blogRouter.delete('/:id', Authenticate, Authorize(Roles.ADMIN), async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ message: 'Invalid blog ID' });
    return;
  }

  await blogService.delete(res, id);
});
