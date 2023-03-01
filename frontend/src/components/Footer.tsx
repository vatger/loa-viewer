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
            <div className="footer">VATGER LoA Viewer. Version {version}</div>
        </>
    );
};

export default Footer;
