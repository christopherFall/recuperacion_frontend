const BASE_URL = 'http://localhost:3333/areas'

export default {
  async getPaginated(page = 1, search = '') {
    const url = new URL(BASE_URL, window.location.origin)
    url.searchParams.set('page', String(page))
    if (search) url.searchParams.set('search', search)

    const res = await fetch(url.toString())
    const data = await res.json()
    return {
      data: data.data,
      total: data.meta?.total ?? 0,
    }
  },

  async create(payload: { nombre: string }) {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || 'Error al crear el área')
    }

    return res.json()
  },

  async update(id: number, payload: { nombre: string }) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || 'Error al actualizar el área')
    }

    return res.json()
  },

  async destroy(id: number) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || 'Error al eliminar el área')
    }

    return res.json()
  },
}