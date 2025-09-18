import { dashboard, login, register } from '@/routes';
import { SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Package } from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome" />

            <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-blue-500 via-purple-500 to-pink-400">
                <nav className="relative z-20 flex items-center justify-between p-6 lg:p-8">
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-purple-600 shadow-lg">
                                <Package className="h-6 w-6 text-white" />
                            </div>
                        </div>
                        <span className="text-xl font-bold text-white">Warehouse</span>
                    </div>

                    <div className="flex items-center space-x-4">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="group inline-flex transform items-center rounded-xl border border-white/20 bg-white/10 px-6 py-3 font-medium text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/20"
                            >
                                <span>Dashboard</span>
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        ) : (
                            <>
                                <Link href={login()} className="px-6 py-3 font-medium text-white/90 transition-colors duration-200 hover:text-white">
                                    Log in
                                </Link>
                                <Link
                                    href={register()}
                                    className="group inline-flex transform items-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-600 hover:to-purple-700"
                                >
                                    <span>Get Started</span>
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </>
                        )}
                    </div>
                </nav>

                <div className="flex h-full w-full items-center justify-center">
                    <h1
                        className="rounded-lg bg-black/10 px-4 py-1 text-5xl font-semibold text-white drop-shadow-lg backdrop-blur-sm"
                        style={{ letterSpacing: '0.03em' }}
                    >
                        Welcome back
                    </h1>
                </div>
            </div>
        </>
    );
}
