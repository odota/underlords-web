import React from 'react';
import items from 'dotaconstants/build/underlords_items.json';
import { ErrorBoundary } from '../ErrorBoundary/ErrorBoundary';

export default class Items extends React.Component {
    public componentDidMount() {
        
    }
    public render() {
        return <div>
            <pre>{JSON.stringify( items.arcane_boots, null, 2 )}</pre>
            <ErrorBoundary>
                <table>
                    <tbody>
                    { Object.keys(items).map( item => <tr key={item}>
                        <td>{item}</td>
                        <td>{items[item as keyof typeof items].tier}</td>
                        <td>{items[item as keyof typeof items].displayName}</td>
                        <td>{items[item as keyof typeof items].icon}</td>
                        <td>{items[item as keyof typeof items].type}</td>
                        <td>{items[item as keyof typeof items].cooldown}</td>
                    </tr> ) }
                    </tbody>
                </table>
            </ErrorBoundary>
        </div>;
    }
}