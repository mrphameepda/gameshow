import { useNavigate } from 'react-router-dom';

interface HomeButtonProps {
    confirmExit?: boolean;
}

export default function HomeButton({ confirmExit = false }: HomeButtonProps) {
    const navigate = useNavigate();

    const handleClick = (e: React.MouseEvent) => {
        if (confirmExit) {
            if (!window.confirm("Quay về Sảnh Game? Tiến trình hiện tại sẽ dừng lại.")) {
                e.preventDefault();
                return;
            }
        }
        navigate('/');
    };

    return (
        <button 
            onClick={handleClick} 
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md font-bold text-xs shadow-lg transition-all active:scale-95 whitespace-nowrap"
        >
            🏠 SẢNH GAME
        </button>
    );
}
