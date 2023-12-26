import React, { useState, useEffect } from 'react';

const EstimationTool = () => {
    const [complexityDevelopment, setComplexityDevelopment] = useState(0);
    const [complexityTest, setComplexityTest] = useState(0);
    const [effort, setEffort] = useState(0);
    const [uncertainty, setUncertainty] = useState(0);
    const [risk, setRisk] = useState(0);
    const [estimate, setEstimate] = useState(0);

    // useEffect(() => {
    // // Example calculation, replace with your own logic
    // const calculatedEstimate = complexityDevelopment + complexityTest + risk + effort;
    // setEstimate(calculatedEstimate);
    // }, [complexityDevelopment, complexityTest, risk, effort]);

    useEffect(() => {
        // Adjust these formulas as needed based on your understanding of the DUSTER tool's logic
        const adjustedComplexityDevelopment = Math.pow(complexityDevelopment, 2); // Example adjustment
        const adjustedComplexityTest = Math.sqrt(complexityTest); // Another example
        const adjustedEffort = effort * 1.5; // Example scaling
        const adjustedRisk = Math.log2(risk + 1); // Example transformation
    
        const calculatedEstimate = adjustedComplexityDevelopment + adjustedComplexityTest + adjustedEffort + uncertainty + adjustedRisk;
        setEstimate(calculatedEstimate);
    }, [complexityDevelopment, complexityTest, effort, uncertainty, risk]);

    return (
        <>
            <div className="slider-container">
                <label>Complexity-Development: {complexityDevelopment}</label>
                <input
                    type="range"
                    min="0"
                    max="3"
                    value={complexityDevelopment}
                    onChange={(e) => setComplexityDevelopment(Number(e.target.value))}
                />
                <div className="slider-labels">
                    <span>Trivial</span>
                    <span>Simple</span>
                    <span>Medium</span>
                    <span>Complex</span>
                </div>
            </div>
            <div className="slider-container">
                <label>Complexity-Test: {complexityTest}</label>
                <input
                    type="range"
                    min="0"
                    max="3"
                    value={complexityTest}
                    onChange={(e) => setComplexityTest(Number(e.target.value))}
                />
                <div className="slider-labels">
                    <span>Trivial</span>
                    <span>Simple</span>
                    <span>Medium</span>
                    <span>Complex</span>
                </div>
            </div>
            <div className="slider-container">
                <label>Effort: {effort}</label>
                <input
                    type="range"
                    min="0"
                    max="3"
                    value={effort}
                    onChange={(e) => setEffort(Number(e.target.value))}
                />
                <div className="slider-labels">
                    <span>Trivial</span>
                    <span>Simple</span>
                    <span>Medium</span>
                    <span>Complex</span>
                </div>
            </div>
            <div className="slider-container">
                <label>Uncertainty: {uncertainty}</label>
                <input
                    type="range"
                    min="0"
                    max="3"
                    value={uncertainty}
                    onChange={(e) => setUncertainty(Number(e.target.value))}
                />
                <div className="slider-labels">
                    <span>Trivial</span>
                    <span>Simple</span>
                    <span>Medium</span>
                    <span>Complex</span>
                </div>
            </div>
            <div className="slider-container">
                <label>Risk: {risk}</label>
                <input
                    type="range"
                    min="0"
                    max="3"
                    value={risk}
                    onChange={(e) => setRisk(Number(e.target.value))}
                />
                <div className="slider-labels">
                    <span>Trivial</span>
                    <span>Simple</span>
                    <span>Medium</span>
                    <span>Complex</span>
                </div>
            </div>
            <h3>Estimated Story Points: {estimate}</h3>
            <style jsx>
                {`
                .slider-container {
                    display:flex;
                    flex-direction: column;
                    width: 300px;
                    margin: 20px;
                  }
                  
                  .slider-labels {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 5px;
                  }
                  
                  .slider-labels span {
                    font-size: 12px;
                  }
                `}
            </style>
        </>
    );
};

export default EstimationTool;