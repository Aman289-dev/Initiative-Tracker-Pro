import type { Request, Response, NextFunction } from 'express';
import * as initiativeService from '../services/initiativeService';

export async function getAllInitiatives(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { status, owner, category, search } = req.query;

    const filters = {
      status: status as string | undefined,
      owner: owner as string | undefined,
      category: category as string | undefined,
      search: search as string | undefined,
    };

    const initiatives = await initiativeService.getAllInitiatives(filters);
    res.json({ success: true, data: initiatives });
  } catch (err) {
    next(err);
  }
}

export async function getInitiativeById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const initiative = await initiativeService.getInitiativeById(id);

    if (!initiative) {
      res.status(404).json({
        success: false,
        error: 'Initiative not found',
        statusCode: 404,
      });
      return;
    }

    res.json({ success: true, data: initiative });
  } catch (err) {
    next(err);
  }
}

export async function createInitiative(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { title, description, owner, status, priority, deadline, category, tags, progress } =
      req.body;

    // Validate required fields
    if (!title || !owner || !deadline) {
      res.status(400).json({
        success: false,
        error: 'Title, owner, and deadline are required',
        statusCode: 400,
      });
      return;
    }

    const initiative = await initiativeService.createInitiative({
      title,
      description,
      owner,
      status,
      priority,
      deadline,
      category,
      tags,
      progress,
    });

    res.status(201).json({ success: true, data: initiative });
  } catch (err) {
    next(err);
  }
}

export async function updateInitiative(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const initiative = await initiativeService.updateInitiative(id, updateData);

    if (!initiative) {
      res.status(404).json({
        success: false,
        error: 'Initiative not found',
        statusCode: 404,
      });
      return;
    }

    res.json({ success: true, data: initiative });
  } catch (err) {
    next(err);
  }
}

export async function deleteInitiative(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const initiative = await initiativeService.deleteInitiative(id);

    if (!initiative) {
      res.status(404).json({
        success: false,
        error: 'Initiative not found',
        statusCode: 404,
      });
      return;
    }

    res.json({ success: true, data: { message: 'Initiative deleted successfully' } });
  } catch (err) {
    next(err);
  }
}
