const URL = 'http://localhost:3333/areas'

export default class EspecialidadService {
  static async getAll() {
    const response = await fetch(URL)
    return response.json()
  }
}
