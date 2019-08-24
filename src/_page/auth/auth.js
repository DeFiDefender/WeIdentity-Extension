/*global chrome*/
import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import MenuIcon from '@material-ui/icons/Menu'
import Grid from '@material-ui/core/Grid';
import UserIcon from '@material-ui/icons/Accessibility'
import OrgIcon from '@material-ui/icons/AccountBalance'
import ArrowIcon from '@material-ui/icons/TrendingFlat'
import Button from '@material-ui/core/Button';
import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles'
import { Link, withRouter } from 'react-router-dom'
import getStorage from '../../_component/Storage'

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    button: {
        margin: theme.spacing(1),
    }
}));



const AuthWithRouter = withRouter(function AuthContent(props) {
    const classes = useStyles();
    const [org, setOrg] = React.useState("组织1");
    const [index, setIndex] = React.useState(1);
    
    const [authHistory,setAuthHistory] = React.useState([])

    const addAuthHistory = () => {
        chrome.storage.local.get()
    }

    const auth = async () => {
        let authHistoryNew = authHistory.push(org);
        await setAuthHistory(authHistoryNew)
        await chrome.storage.local.set({"authHistory":authHistory},function(){
        })
        await props.history.push({pathname: `/home`})
    }

    useEffect(() => {
        chrome.storage.local.get(["authHistory"],function(result){
            console.log('authHistory currently is ' + result.authHistory);
            if (result.authHistory != undefined){
                setAuthHistory(result.authHistory)
            }
        })
    }, []);

    useEffect(() => {
        /*
        chrome.storage.local.get(['weId'], function(result) {
            console.log('Value currently is ' + result.weId);
            setData(result.weId)
        });
        */
       getStorage("requestOrg",function(result){
            console.log('requestOrg currently is ' + result.requestOrg);
            setOrg(result.requestOrg);
            
            getStorage("requestIndex",function(result){
                console.log('requestIndex currently is ' + result.requestIndex);
                setIndex(result.requestIndex);
           })
       })
    }, []);

    return (
        <Grid container>
            <Grid item xs={12}>
                <Typography variant="h3" gutterBottom>
                        授权
                </Typography>
            </Grid>
            <Grid item xs={4}>
                <UserIcon />
            </Grid>
            <Grid item xs={4}>
                <ArrowIcon />
            </Grid>
            <Grid item xs={4}>
                <OrgIcon />
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h7" gutterBottom>
                        是否授权给 {org}?
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Button variant="outlined" className={classes.button} onClick={()=>{props.history.push({pathname: `/home`})}}>
                    取消
                </Button>
                <Button variant="outlined" color="primary" className={classes.button} onClick={auth}>
                    授权
                </Button>
            </Grid>
        </Grid>
    )
})

export {AuthWithRouter as AuthContent}


