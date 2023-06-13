import { Service } from 'typedi'
import { Request, Response } from 'express'
import { FilterService } from '../services/FilterService'

@Service()

export class FilterController {
    constructor(private readonly filterService: FilterService) {
    }

    async showAll(req: Request, res: Response): Promise<any> {
        const { user_id } = req['user']
        const { workspace_id } = req['user_workspace'];
        const { page_no } = req.body;
        const response = await this.filterService.fetchAll(user_id, workspace_id, page_no)
        return res.status(response.status).send(response)
    }

    async getByType(req: Request, res: Response): Promise<any> {
        const { user_id } = req['user']
        const { workspace_id } = req['user_workspace'];
        const { page_no, filter_type } = req.body;
        const response = await this.filterService.getByType(user_id, workspace_id, filter_type, page_no)
        return res.status(response.status).send(response)
    }

    async save(req: Request, res: Response): Promise<any> {
        const { name, filter_type, smart_filter, regular_filter } = req.body
        const { user_id } = req['user']
        const { workspace_id } = req['user_workspace'];
        const response = await this.filterService.save(user_id, workspace_id, name, filter_type, smart_filter, regular_filter)
        console.log(response)
        return res.status(response.status).send(response)
    }

    async saveAs(req: Request, res: Response): Promise<any> {
        const { name, filter_type, smart_filter, regular_filter } = req.body
        const { user_id } = req['user']
        const { workspace_id } = req['user_workspace'];
        const response = await this.filterService.saveAs(user_id, workspace_id, name, filter_type, smart_filter, regular_filter)
        return res.status(response.status).send(response)
    }

    async delete(req: Request, res: Response): Promise<any> {
        const { id } = req.query
        const { user_id } = req['user']
        const { workspace_id } = req['user_workspace'];
        const response = await this.filterService.delete(id, user_id, workspace_id)
        return res.status(response.status).send(response)
    }

}