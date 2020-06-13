import * as React from 'react';
import * as ReactDOM from "react-dom"
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch
} from "react-router-dom";
import './App.css';
import Students from "./Students";
import Sets from "./Sets";
import PlanTasks from "./PlanTasks";
import Teachers from "./Teachers";
import TeacherPage from "./TeacherPage";
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Plans from "./Plans";
import PlanPage from "./PlanPage";

const App = () => {

    const Logout = () => {
        return <h1>Logout</h1>
    }

    return (
        <Router>
            <div>
                <header>
                    <img className="logo" src="https://www.spbstu.ru/local/templates/main/img/logo.png"
                         alt="Логотип политеха"/>
                    <Link className="navigation_link" to="/">Главная</Link>
                    <Link className="navigation_link" to="/teachers">Преподаватели</Link>
                    <Link className="navigation_link" to="/sets">Множества</Link>
                    <Link className="navigation_link" to="/plans">Планы</Link>
                    <div className="sign_out_container">
                        <div className="logged_bar">
                            <Avatar size={64} icon={<UserOutlined />} />
                            <span>Лопатинский И.С.</span>
                        </div>
                        <Link className="navigation_link" to="/logout">Выход</Link>
                    </div>
                </header>

                {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
                <div className="main_content_container">
                    <Switch>
                        <Route exact path="/teachers" component={Teachers}/>
                        <Route path="/teachers/:id" component={TeacherPage}/>
                        <Route exact path="/sets" component={Sets}/>
                        <Route exact path="/" component={PlanTasks}/>
                        <Route exact path="/plans" component={Plans}/>
                        <Route path="/plans/:id" component={PlanPage}/>
                        <Route exact path="/logout" component={Logout}/>
                    </Switch>
                </div>
            </div>
        </Router>
    );

};

ReactDOM.render(<App/>, document.getElementById("root"))
