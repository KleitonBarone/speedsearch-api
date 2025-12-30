import { describe, it, expect, vi, beforeEach } from 'vitest'
import app from './route'
import { redis } from '@/app/lib/redis'
import { Hono } from 'hono'

// Mock redis
vi.mock('@/app/lib/redis', () => ({
  redis: {
    zrank: vi.fn(),
    zrange: vi.fn(),
  },
}))

const route = app as unknown as Hono

describe('Search API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('should return 400 if query is missing', async () => {
    const res = await route.request('/api/search')
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.message).toBe('Missing query parameter')
  })

  it('should return search results correctly', async () => {
    const mockQuery = 'TEST'
    vi.mocked(redis.zrank).mockResolvedValue(0)
    vi.mocked(redis.zrange).mockResolvedValue(['TEST*', 'TESTING*'])

    const res = await route.request(`/api/search?q=${mockQuery}`)
    expect(res.status).toBe(200)
    
    const body = await res.json()
    expect(body.results).toEqual(['TEST', 'TESTING'])
    expect(body.duration).toBeGreaterThanOrEqual(0)
    
    expect(redis.zrank).toHaveBeenCalledWith('terms', mockQuery)
    expect(redis.zrange).toHaveBeenCalledWith('terms', 0, 100)
  })

  it('should return empty results if nothing is found', async () => {
    vi.mocked(redis.zrank).mockResolvedValue(null)

    const res = await route.request('/api/search?q=UNKNOWN')
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.results).toEqual([])
  })

  it('should handle redis errors gracefully', async () => {
    vi.mocked(redis.zrank).mockRejectedValue(new Error('Redis failure'))

    const res = await route.request('/api/search?q=TEST')
    expect(res.status).toBe(500)
    const body = await res.json()
    expect(body.message).toBe('Internal Server Error')
  })
})
