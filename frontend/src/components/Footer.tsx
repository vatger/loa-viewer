import { useEffect, useState } from 'react';
import metaService from '../services/metaService';

const Footer = (props: any) => {
    const [version, setVersion] = useState<any>([]);

    useEffect(() => {
        metaService.getVersion().then(data => {
            setVersion(data);
        });
    }, []);

    return (
        <>
            <div className="footer">
                <div className="flex justify-content-between">
                    <span className="flex align-items-start ml-2">VATGER LoA Viewer. Version {version}</span>
                    <span className="flex align-items-center mr-2">
                        <a href="https://vatsim-germany.org/imprint" target="_blank" style={{ textDecoration: 'none' }}>
                            Imprint
                        </a>
                    </span>
                </div>
            </div>
        </>
    );
};

export default Footer;
