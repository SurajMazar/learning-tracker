import { BaseResource } from './base.resource.js'
import User from '#models/user'

export class UserResource extends BaseResource<User> {
  async formatter(data: User): Promise<Record<string, any>> {
    return {
      id: data?.id,
      first_name: data?.firstName,
      last_name: data?.lastName,
      full_name: data?.fullName,
      email: data?.email,
      username: data?.username,
    }
  }
}
