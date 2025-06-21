const URL = 'http://localhost:3333/instructores'

export default class EspecialistaService {
  static async getAll({ page = 1, limit = 10, search = '' }) {
    const params = new URLSearchParams({ page, limit, search })
    const response = await fetch(`${URL}?${params.toString()}`)
    return response.json()
  }

  static async getInactivos() {
    const response = await fetch(`${URL}/inactivos`)
    return response.json()
  }

  static async create(data: any) {
    const response = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return response.json()
  }

  static async update(id: number, data: any) {
    const response = await fetch(`${URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return response.json()
  }

  static async delete(id: number) {
    const response = await fetch(`${URL}/${id}`, { method: 'DELETE' })
    return response.json()
  }

  static async restore(id: number) {
    const response = await fetch(`${URL}/${id}/restaurar`, {
      method: 'POST',
    })
    return response.json()
  }

  static async getById(id: number) {
  const res = await fetch(`http://localhost:3333/especialistas/${id}`)
  return res.json()
    }

    static async deleteDisponibilidad(id: number) {
    const res = await fetch(`http://localhost:3333/disponibilidades/${id}`, {
        method: 'DELETE',
    })
    return res.json()
    }

    static async createDisponibilidad(data: {
    especialista_id: number
    dia_semana: string
    hora_inicio: string
    hora_fin: string
    }) {
    const res = await fetch(`http://localhost:3333/disponibilidades`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    return res.json()
    }
}
