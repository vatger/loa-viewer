import { Menubar } from 'primereact/menubar';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();
    const items = [
        {
            label: 'Conditions',
            icon: 'pi pi-fw pi-file',
            command: () => {
                navigate('/conditions');
            },
        },
        {
            label: 'Map',
            icon: 'pi pi-fw pi-map',
            command: () => {
                navigate('/map');
            },
        },
    ];

    return (
        <>
            <Menubar model={items}>
                <Link to="/conditions" className="p-menuitem-link">
                    Conditions
                </Link>
                <Link to="/map" className="p-menuitem-link">
                    Map
                </Link>
            </Menubar>
        </>
    );
}
