import { createProxyMiddleware } from 'http-proxy-middleware'
export default function (app) {
  app.use(
    '^/api*',
    createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true,
    })
  )
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://host.docker.internal:8080',
      changeOrigin: true,
    })
  )
}
