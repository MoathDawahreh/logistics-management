import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Put,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'; // Import the JWT authentication guard
import { DeliveryRoute, ShipmentDto } from './dto/shipment.dto'; // Define DTOs for shipment data
import { Roles, getCurrentUser } from 'src/common/decorators';
import { ShipmentService } from './shipment.service';
import { AccessTokenGuard } from '../auth/guards';
import { RolesGuard } from 'src/common/guards';
import { UserDocument } from '../user/user.schema';
import { ROLES } from 'src/common/constants';

@Controller('shipment')
export class ShipmentController {
  constructor(private readonly shipmentService: ShipmentService) {}

  @Post()
  @UseGuards(AccessTokenGuard, RolesGuard)
  async createShipment(
    @Body() shipmentDto: ShipmentDto,
    @getCurrentUser() user: UserDocument,
  ) {
    return this.shipmentService.createShipment(shipmentDto, user.id);
  }

  @Get()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(ROLES.SUPER_ADMIN, ROLES.USER)
  async getUserShipments(@getCurrentUser() user: UserDocument) {
    return this.shipmentService.getUserShipments(user.id);
  }

  @Get(':id')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(ROLES.SUPER_ADMIN, ROLES.USER)
  async getShipmentById(
    @Param('id') id: string,
    @getCurrentUser() user: UserDocument,
  ) {
    return this.shipmentService.getShipmentById(id);
  }

  @Put(':id')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(ROLES.SUPER_ADMIN, ROLES.USER)
  async updateShipment(
    @Param('id') id: string,
    @Body() shipmentDto: ShipmentDto,
  ) {
    return this.shipmentService.updateShipment(id, shipmentDto);
  }

  @Patch(':id/delivery-route')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(ROLES.SUPER_ADMIN, ROLES.USER)
  async updateDeliveryRoute(
    @Param('id') id: string,
    @Body() deliveryRoute: DeliveryRoute,
  ) {
    return this.shipmentService.updateDeliveryRoute(id, deliveryRoute);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(ROLES.SUPER_ADMIN)
  async deleteShipment(@Param('id') id: string) {
    // Delete a specific shipment by ID
    return this.shipmentService.deleteShipment(id);
  }
}
