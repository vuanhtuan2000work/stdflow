'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Card } from '@/components/ui/card'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
    this.props.onError?.(error, errorInfo)
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
          <Card className="max-w-md w-full text-center space-y-6 p-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-error-50 dark:bg-error-900/20 rounded-full flex items-center justify-center">
                <Icon name="alert-triangle" size={32} color="error" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Có lỗi xảy ra
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {this.state.error?.message || 'Đã xảy ra lỗi không xác định'}
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left">
                <summary className="text-xs text-gray-500 dark:text-gray-400 cursor-pointer">
                  Chi tiết lỗi (Dev only)
                </summary>
                <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            <div className="flex gap-2">
              <Button onClick={this.handleReset} className="flex-1">
                <Icon name="check-circle" size={20} className="mr-2" />
                Thử lại
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.href = '/dashboard'}
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


