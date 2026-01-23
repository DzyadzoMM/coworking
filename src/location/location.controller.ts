import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { LocationService } from './location.service';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}
  
  @Post('new')
  async createLocation(
    @Body('name') name: string,
    @Body('address') address: string,
    @Body('description') description?: string,
    @Body('image') image?: string,
  ) {
    return await this.locationService.create(name, address, description, image);
  }
  @Get()
  async getAllLocations() {
    return await this.locationService.findAll();
  }
  @Get(':id')
  async getLocationById(@Param('id') id:number) {
    return await this.locationService.findById(id);
  }
}
