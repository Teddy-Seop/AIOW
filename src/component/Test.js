import React from 'react';

class Test extends React.Component{

    render(){
        const login = () =>{
            alert("Login...")
        }
        return (
            <div>
                Workspace <input type="text" id="workspace" /><br/>
                <button type="button">Enter</button>
            </div>
        )
    }
}

export default Test;