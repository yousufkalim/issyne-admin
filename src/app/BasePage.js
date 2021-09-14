import React, {Suspense} from "react";
import {Redirect, Switch} from "react-router-dom";
import {LayoutSplashScreen, ContentRoute} from "../_metronic/layout";
import {BuilderPage} from "./pages/BuilderPage";
import {DashboardPage} from "./pages/DashboardPage";
import UserPage from "./pages/UserPage";
import TeacherPage from "./pages/TeacherPage"
import PackagesPage from "./pages/PackagesPage";

export default function BasePage() {
    // useEffect(() => {
    //   console.log('Base page');
    // }, []) // [] - is required if you need only one call
    // https://reactjs.org/docs/hooks-reference.html#useeffect

    return (
        <Suspense fallback={<LayoutSplashScreen/>}>
            <Switch>
                {
                    /* Redirect from root URL to /dashboard. */
                    <Redirect exact from="/" to="/dashboard"/>
                }
                <ContentRoute path="/dashboard" component={DashboardPage}/>
                <ContentRoute path="/builder" component={BuilderPage}/>
                <ContentRoute path="/user" component={UserPage} />
                <ContentRoute path="/teacher" component={TeacherPage} />
                <ContentRoute path="/packages" component={PackagesPage} />
                <Redirect to="error/error-v1"/>
            </Switch>
        </Suspense>
    );
}
