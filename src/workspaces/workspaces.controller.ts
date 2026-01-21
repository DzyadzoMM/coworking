import { Controller, Post, Body, Get } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';

@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}
  
  @Post ('new')
  async createWorkspace(
    @Body('name') name: string,
    @Body('type') type: string,
    @Body('price') price: number,
    @Body('location') location: number,
    ){
      return await this.workspacesService.create(name, type, price, location);
    }
    @Get()
  async getAllWorkspaces() {
    return await this.workspacesService.findAll();
  }
}
