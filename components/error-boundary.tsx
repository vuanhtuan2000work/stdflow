'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Card } from '@/components/ui/card'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
          <Card className="max-w-md w-full text-center p-6">
            <Icon name="alert-circle" size={48} color="active" className="mx-auto mb-4 text-error-500" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Đã xảy ra lỗi
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {this.state.error?.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.'}
            </p>
            <div className="flex gap-3">
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  this.setState({ hasError: false, error: null })
                  window.location.reload()
                }}
                className="flex-1"
              >
                Tải lại trang
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={() => window.location.href = '/'}
                className="flex-1"
              >
                Về trang chủ
              </Button>
            </div>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}


