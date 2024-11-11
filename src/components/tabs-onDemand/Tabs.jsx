// import React, { useEffect, useState } from 'react';
// import './index.css'; // Ensure your CSS is imported

// const Tabs = (props) => {
//     const [tabsHeaders, setTabsHeaders] = useState([]);
//     const [contentMap, setContentMap] = useState({});
//     const [active, setActive] = useState('');

//     const { children } = props;

//     useEffect(() => {
//         const headers = [];
//         const map = {};
//         React.Children.forEach(children, (element) => {
//             if (!React.isValidElement(element)) return;
//             const { title } = element.props;
//             headers.push(title);
//             map[title] = element.props.children;
//         });
//         setTabsHeaders(headers);
//         setActive(headers[0]);
//         setContentMap(map);
//     }, [children]);

//     const changeTab = (header) => {
//         setActive(header);
//     };

//     return (
//         <div>
//             <div className="tab-container">
//                 {tabsHeaders.map((header) => (
//                     <button
//                         className={`tab ${active === header ? 'selected' : 'not-selected'}`}
//                         key={header}
//                         onClick={() => changeTab(header)}
//                     >
//                         {header}
//                     </button>
//                 ))}
//             </div>
//             <div className="tab-content">
//                 {Object.keys(contentMap).map((key, idx) => {
//                     if (key === active) {
//                         return <div key={idx}>{contentMap[key]}</div>;
//                     }
//                     return null;
//                 })}
//             </div>
//         </div>
//     );
// };

// export default Tabs;


import React, { useEffect, useState } from 'react';
import './index.css'; // Ensure your CSS is imported

const Tabs = (props) => {
    const { value, onChange, children } = props;
    const [tabsHeaders, setTabsHeaders] = useState([]);
    const [contentMap, setContentMap] = useState({});

    useEffect(() => {
        const headers = [];
        const map = {};
        React.Children.forEach(children, (element) => {
            if (!React.isValidElement(element)) return;
            const { title } = element.props;
            headers.push(title);
            map[title] = element.props.children;
        });
        setTabsHeaders(headers);
        setContentMap(map);
    }, [children]);

    const changeTab = (header) => {
        onChange(null, tabsHeaders.indexOf(header)); // Call the parent's onChange with the new index
    };

    return (
        <div>
            <div className="tab-container">
                {tabsHeaders.map((header) => (
                    <button
                        className={`tab ${value === header ? 'selected' : 'not-selected'}`}
                        key={header}
                        onClick={() => changeTab(header)}
                    >
                        {header}
                    </button>
                ))}
            </div>
            <div className="tab-content">
                {Object.keys(contentMap).map((key, idx) => {
                    if (key === value) {
                        return <div key={idx}>{contentMap[key]}</div>;
                    }
                    return null;
                })}
            </div>
        </div>
    );
};

export default Tabs;

