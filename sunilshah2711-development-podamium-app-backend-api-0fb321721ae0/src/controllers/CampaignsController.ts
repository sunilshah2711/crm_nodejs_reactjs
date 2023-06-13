import { Service } from "typedi";
import { Request, Response } from "express";
import { CampaignService } from "../services/CampaignService";

@Service()
export class CampaignsController {
  constructor(private readonly campaignService: CampaignService) { }

  /**
   * Get user id
   */

  async getByUUID(req: Request, res: Response): Promise<any> {
    const { id } = req.query;
    const { workspace_id } = req["user_workspace"];
    const response = await this.campaignService.getByUUID(id, workspace_id);
    return res.status(response.status).send(response);
  }

  /**
   * Show all campaign
   */

  async showAll(req: Request, res: Response): Promise<any> {
    const { user_id } = req["user"];
    const { workspace_id } = req["user_workspace"];
    const { page_no } = req.body;
    const response = await this.campaignService.fetchAll(
      user_id,
      workspace_id,
      page_no
    );
    return res.status(response.status).send(response);
  }

  /**
   * Create campaign
   */

  async create(req: Request, res: Response): Promise<any> {
    const { title, subject, template_id, audience, schedule, status } =
      req.body;
    const { user_id } = req["user"];
    const { workspace_id } = req["user_workspace"];
    const response = await this.campaignService.create(
      title,
      subject,
      template_id,
      audience,
      schedule,
      status,
      user_id,
      workspace_id
    );
    return res.status(response.status).send(response);
  }

  /**
   * Update campaign
   */

  async update(req: Request, res: Response): Promise<any> {
    const { title, subject, template_id, audience, schedule, status } =
      req.body;
    const { id } = req.query;
    const { user_id } = req["user"];
    const { workspace_id } = req["user_workspace"];
    const response = await this.campaignService.update(
      id,
      title,
      subject,
      template_id,
      audience,
      schedule,
      status,
      user_id,
      workspace_id
    );
    return res.status(response.status).send(response);
  }

  /**
   * Delete campaign
   */

  async delete(req: Request, res: Response): Promise<any> {
    const { id } = req.query;
    const { user_id } = req["user"];
    const { workspace_id } = req["user_workspace"];
    const response = await this.campaignService.delete(
      id,
      user_id,
      workspace_id
    );
    return res.status(response.status).send(response);
  }
}
