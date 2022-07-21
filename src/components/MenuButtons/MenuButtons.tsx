import './MenuButtons.css'
import React from "react";
import {Link as RouterLink} from "react-router-dom";
import {Link} from "@mui/material";

export default function MenuButtons(){
    return <div id={'navbar'}>
        <div id={'menu-buttons-container'}>
            <Link underline="hover"
                  color="inherit"
                  to="/"
                  component={RouterLink}
                  >Home</Link>
            <Link underline="hover"
                  color="inherit"
                  to="/tutorial"
                  component={RouterLink}
                  >Tutorial</Link>
            <Link underline="hover"
                  color="inherit"
                  to="/tutorial"
                  component={RouterLink}
            >About</Link>
        </div>
        <div id={'divider'}/>
    </div>


}