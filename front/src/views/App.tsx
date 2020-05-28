import * as React from 'react';
import * as ReactDOM from "react-dom"
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import './App.css';
import Students from "./Students";
import Sets from "./Sets";

const App = () => {

    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Главная</Link>
                        </li>
                        <li>
                            <Link to="/teachers">Преподаватели</Link>
                        </li>
                        <li>
                            <Link to="/students">Студенты</Link>
                        </li>
                        <li>
                            <Link to="/sets">Множества</Link>
                        </li>
                    </ul>
                </nav>

                {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
                <Switch>
                    <Route path="/teachers">
                        <Teachers />
                    </Route>
                    <Route path="/students">
                        <Students/>
                    </Route>
                    <Route path="/sets">
                        <Sets/>
                    </Route>
                    <Route path="/">
                        <Main />
                    </Route>
                </Switch>
            </div>
        </Router>
    );

};

function Main() {
    return <h2>Главная страница</h2>;
}

function Teachers() {
    return <h2>Преподаватели</h2>;
}

ReactDOM.render(<App/>, document.getElementById("root"))
