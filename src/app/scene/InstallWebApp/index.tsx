import { useEffect } from 'react'
import { driver } from 'driver.js';
import "driver.js/dist/driver.css";

const InstallWebApp = () => {

    const d = driver();

    useEffect(() => {

        d.setSteps([
            {
                element: '#chromeOnPC',
                popover: {
                    title: 'Open Chrome',
                    description: `Open you Chrome Application on your System`,

                },
            },
            {
                element: '#chromeOnPC',
                popover: {
                    title: 'Open Specter',
                    description: 'Type the following URL in Chrome to open Specter App in Chrome.\nhttps://dev.specterman.io',
                },
            },
        ]);

        d.drive();

        return () => {
            d.destroy();
        }
    }, []);

    return (
        <div className='h-screen w-full flex items-center justify-center flex-col gap-5'>
            <div id='chromeOnPC'>
                <button onClick={() => d.drive()}>Install Specter Web App via Chrome on PC</button>
            </div>
            <div id='chromeOnMobile'>
                <button onClick={() => d.drive()}>Install Specter Web App via Chrome on Mobile</button>
            </div>

        </div>
    );
}

export default InstallWebApp;
