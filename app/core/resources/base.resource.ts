export abstract class BaseResource<T = any> {
  protected data: null | T | Array<T> = null
  protected pagination: boolean = false
  abstract formatter(data: T | T[]): Promise<Record<string, any>>

  setData(data: null | T | Array<T> = null, pagination = false) {
    this.data = data
    this.pagination = pagination
    return this
  }

  async serialize() {
    if (!this.data) return this.data

    if (Array.isArray(this.data) && !this.pagination) {
      return await Promise.all(this.data.map((value) => this.formatter(value)))
    }

    return await this.formatter(this.data)
  }
}
