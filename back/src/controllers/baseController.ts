import { Request, Response } from "express";
import { Model } from "mongoose";

class BaseController<T> {
  model: Model<T>;
  constructor(model: any) {
    this.model = model;
  }

  async getAll(req: Request, res: Response) {
    const filter = req.query.owner;
    try {
      if (filter) {
        const data = await this.model.find({ owner: filter });
        res.status(200).send(data);
      } else {
        const data = await this.model.find();
        res.status(200).send(data);
      }
    } catch (error) {
      console.log("Error: ", error);
      res.status(500).send(error);
    }
  }

  async create(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const data = new this.model({ ...req.body, owner: userId });
      await data.save();
      res.status(201).send(data);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async getById(req: Request, res: Response) {
    const id = req.params.id;
    try {
      const data = await this.model.findById(id);
      if (!data) {
        res.status(404).send("Not found");
      } else {
        res.status(200).send(data);
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async deleteItemById(req: Request, res: Response) {
    const id = req.params.id;
    try {
      const data = await this.model.findById({ _id: id });
      if (data) {
        await this.model.findByIdAndDelete({ _id: id });
        res.status(204).send("Item deleted");
      } else {
        res.status(404).send("Not found");
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async updateItemById(req: Request, res: Response) {
    const id = req.params.id;
    const userId = req.params.userId;
    try {
      const data = await this.model.findById({ _id: id });
      if (!data) {
        res.status(404).send("Not found");
      } else {
        data.set({ ...req.body, owner: userId });
        await data.save();
        res.status(200).send(data);
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async getByUserId(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const data = await this.model.find({ owner: userId });
      if(!data) {
        res.status(404).send("Not found");
        return;
      }
      res.status(200).send(data);
    } catch (error) {
      res.status(500).send(error);
    }
  }
}

export default BaseController;
