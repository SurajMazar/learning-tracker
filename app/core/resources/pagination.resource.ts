import { BaseResource } from './base.resource.js'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'

export class PaginationResource extends BaseResource<ModelPaginatorContract<any>> {
  async formatter(data: ModelPaginatorContract<any>): Promise<Record<string, any>> {
    return {
      current_page: data?.currentPage,
      first_page: data?.firstPage,
      per_page: data?.perPage,
      last_page: data?.lastPage,
      total: data?.total,
    }
  }
}
