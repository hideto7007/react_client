import { render, screen } from '@testing-library/react'
import Custom404 from '../../pages/404'

describe('404.tsx', () => {
  it('404ページ レンダリングチェック', () => {
    render(<Custom404 />)

    // レンダリングチェック1
    const render1 = screen.getByText('404 - ページが見つかりません')
    expect(render1).toBeInTheDocument()

    // レンダリングチェック2
    const render2 = screen.getByText(
      'urlが存在しないか、パスが間違っています。'
    )
    expect(render2).toBeInTheDocument()
  })
})
