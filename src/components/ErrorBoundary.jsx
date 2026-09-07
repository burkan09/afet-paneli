import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Yakalanan hata:", error, info);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-bold text-red-400 mb-3">
            Bir şeyler ters gitti
          </h1>
          <p className="text-sm text-slate-400 mb-6">
            Uygulama beklenmedik bir hatayla karşılaştı. Sayfayı yenilemek
            genellikle sorunu çözer.
          </p>
          <p className="text-xs text-slate-600 font-mono bg-slate-900 rounded p-3 mb-6 text-left overflow-auto">
            {this.state.error.message}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-emerald-700 hover:bg-emerald-600 px-5 py-2 rounded text-sm transition-colors"
          >
            Sayfayı yenile
          </button>
        </div>
      </div>
    );
  }
}