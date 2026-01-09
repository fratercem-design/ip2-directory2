import Link from "next/link";

export default function AccessDeniedPage() {
    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-zinc-900 border border-red-900/50 p-8 rounded-xl text-center shadow-2xl">
                <div className="w-16 h-16 bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
                <p className="text-zinc-400 mb-6">
                    You do not have permission to view this area.
                </p>
                <div className="flex flex-col gap-3">
                    <Link
                        href="/"
                        className="w-full bg-white text-black font-bold py-3 rounded hover:bg-zinc-200 transition-colors"
                    >
                        Return Home
                    </Link>
                    <Link
                        href="/login?next=/admin"
                        className="w-full bg-zinc-800 text-white font-bold py-3 rounded hover:bg-zinc-700 transition-colors"
                    >
                        Switch Account
                    </Link>
                </div>
            </div>
        </div>
    );
}
