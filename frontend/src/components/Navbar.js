'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// A linha que causava o erro ('import styles from...') foi removida.

const Navbar = () => {
    const pathname = usePathname();

    // Esta função define o estilo do link com base na página atual
    const linkStyle = (path) => ({
        fontWeight: pathname === path ? 'bold' : 'normal',
        color: pathname === path ? '#6a1b9a' : '#333', // Cor roxa se estiver ativo
        textDecoration: 'none',
        padding: '1rem',
        borderBottom: pathname === path ? '2px solid #6a1b9a' : '2px solid transparent',
        transition: 'all 0.2s ease-in-out',
    });

    return (
        <nav style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: '#fff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            padding: '0 2rem',
            position: 'sticky',
            top: 0,
            zIndex: 10,
        }}>
            <Link href="/" style={linkStyle('/')}>Dashboard</Link>
            <Link href="/ingredients" style={linkStyle('/ingredients')}>ingredients</Link>
            <Link href="/products" style={linkStyle('/products')}>products</Link>
            <Link href="/sales" style={linkStyle('/sales')}>Registrar Venda</Link>
        </nav>
    );
};

export default Navbar;