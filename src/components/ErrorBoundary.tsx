import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "./ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // 다음 렌더링에서 폴백 UI가 보이도록 상태를 업데이트합니다.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 에러 로깅 서비스에 에러를 기록할 수 있습니다.
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // 커스텀 폴백 UI가 제공된 경우 그것을 사용
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 기본 에러 UI
      return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-red-100 p-4 dark:from-red-950 dark:to-red-900">
          <div className="shadow-elegant bg-card w-full max-w-md rounded-lg p-8 text-center">
            <div className="mb-6">
              <AlertTriangle className="mx-auto mb-4 h-16 w-16 text-red-500" />
              <h1 className="text-card-foreground mb-2 text-2xl font-bold">
                앗! 문제가 발생했습니다
              </h1>
              <p className="text-muted-foreground">
                예상치 못한 오류가 발생했습니다. 불편을 드려 죄송합니다.
              </p>
            </div>

            {/* 개발 환경에서만 에러 상세 정보 표시 */}
            {typeof window !== "undefined" &&
              window.location.hostname === "localhost" &&
              this.state.error && (
                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-left">
                  <h3 className="mb-2 font-semibold text-red-800">
                    에러 정보:
                  </h3>
                  <p className="mb-2 text-sm text-red-700">
                    {this.state.error.message}
                  </p>
                  {this.state.errorInfo && (
                    <details className="text-xs text-red-600">
                      <summary className="mb-1 cursor-pointer">
                        스택 트레이스
                      </summary>
                      <pre className="max-h-32 overflow-auto whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

            <div className="space-y-3">
              <Button
                onClick={this.handleReset}
                className="w-full"
                variant="default"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                다시 시도
              </Button>

              <Button
                onClick={this.handleReload}
                variant="outline"
                className="w-full"
              >
                <Home className="mr-2 h-4 w-4" />
                페이지 새로고침
              </Button>
            </div>

            <div className="border-border mt-6 border-t pt-4">
              <p className="text-muted-foreground text-xs">
                문제가 계속 발생하면 브라우저의 개발자 도구를 확인하거나
                <br />
                localStorage를 초기화해보세요.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
