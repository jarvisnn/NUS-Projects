import React from 'react';
import mui, {Card, FlatButton} from 'material-ui';
import {Grid, Row, Col} from 'react-bootstrap';
import {PropTypes, Link} from 'react-router';
import {AppStore} from '../stores'
let ThemeManager = new mui.Styles.ThemeManager();

class About extends React.Component {

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  }

  constructor(props, context) {
    super(props, context);
    this.state = {};
    this.state.user = AppStore.getState().user;
  }

  componentWillMount() {
    AppStore.listen(this.onChange);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    AppStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  render() {
    let style={
      introHeader: {
        paddingTop: '100px',
        paddingBottom: '100px',
        textAlign: 'center',
        color: '#f8f8f8',
        background: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(../img/intro-bg-2.jpg) no-repeat center center',
        backgroundSize: 'cover, cover'
      },
      overlay: {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        zIndex: '10',
        backgroundColor: 'rgba(0,0,0,0.5)' /*dim the background*/
      },
      header: {
        fontFamily: 'Roboto Slab', 
        fontWeight: '700'
      },
      headerSub: {
        fontWeight: '300'
      },
      contentSection: {
        padding: '50px 0',
        backgroundColor:'#f8f8f8'
      },
      contentSectionB: {
        padding: '50px 0',
        borderTop: '1px solid #e7e7e7',
        borderBottom: '1px solid #e7e7e7'
      },
      banner: {
        padding: '100px 0',
        color: '#f8f8f8',
        background: 'url(../img/banner-bg.jpg) no-repeat center center',
        backgroundSize: 'cover',
      },
      bannerHeader: {
        margin: '0',
        textShadow: '2px 2px 3px rgba(0,0,0,0.6)',
        fontSize: '3em'
      },
      bannerButton: {
        float:'left',
        marginTop: '15px'
      },
      hrLeft: {
        float: 'left',
        width: '200px',
        borderTop: '3px solid #e7e7e7'
      },
      sectionHeader: {
        marginBottom: '30px'
      },
      lead: {
        fontSize: '18px',
        fontWeight: '400'
      }
    }
    return (
      <div className='about'>
        <Card style={style.introHeader}>
          <Grid>
            <Row>
              <Col lg={12}>
                <div className="intro-message">
                  <h1 style={style.header}>FreeLah!</h1>
                  <div>
                    <h3 style={style.headerSub}>Give away your old items.</h3>
                    <h3 style={style.headerSub}>Earn credits.</h3>
                    <h3 style={style.headerSub}>Get free stuffs!</h3>
                  </div>
                  <hr className="intro-divider"/>
                  <Link to={`/`}>
                  {
                    this.state.user?
                    (<FlatButton label="Continue to app"/>)
                    :
                    (<FlatButton label="Get started"/>)
                  }
                  </Link>
                </div>
              </Col>
            </Row>
          </Grid>
        </Card>
        <Card style={style.contentSection}>
          <Grid>
            <Row>
              <Col lg={5} sm={6}>
                <hr style={style.hrLeft}/>
                <div className="clearfix"></div>
                <h2 style={style.sectionHeader}>
                  De-crapify your home. Less possessions, more life.
                </h2>
                <p style={style.lead} >
                  Moving out and want to get rid of unneeded things? Or start feeling cluttered when there are always "too much stuff" around you? Snap a picture and post here so that others can take it.
                </p>
              </Col>
              <Col lg={5} sm={6} lgOffset={2}>
                <img className="img-responsive" src="../img/garage-sale.jpg" alt=""/>
              </Col>
            </Row>
          </Grid>
        </Card>

        <Card style={style.contentSectionB}>
          <Grid>
            <Row>
              <Col lg={5} lgOffset={1} smPush={6} sm={6}>
                <hr style={style.hrLeft}/>
                <div className="clearfix"></div>
                <h2 style={style.sectionHeader}>Because giving is receiving.</h2>
                <p style={style.lead}>
                  Receive points everytime you give away an item. Get more points by giving away better item. More people wanting and bidding for your items means you get more points
                </p>
              </Col>
              <Col lg={5} smPull={6} sm={6}>
                <img className="img-responsive" src="../img/credit.jpg" alt=""/>
              </Col>
            </Row>
          </Grid>
        </Card>

        <Card style={style.contentSection}>
          <Grid>
            <Row>
              <Col lg={5} sm={6}>
                <hr style={style.hrLeft}/>
                <div className="clearfix"></div>
                <h2 style={style.sectionHeader}>
                  Interesting stuff are interesting.
                </h2>
                <p style={style.lead} >
                  Use the points you earned to claim some interesting stuff from other people. More interesting items also cost more points.
                  But you can always get more points by refer your friends to Freelah, because sharing is caring, why not?
                </p>
              </Col>
              <Col lg={5} sm={6} lgOffset={2}>
                <img className="img-responsive" src="../img/funny-item.jpg" alt=""/>
              </Col>
            </Row>
          </Grid>
        </Card>


        <Card style={style.banner}>
          <Grid>
            <Row>
              <Col lg={6}>
                <h2 style={style.bannerHeader}>Sign up now and start giving away!</h2>
              </Col>
              <Col lg={6}>
                <Link style={style.bannerButton} to={`/`}>
                  {
                    this.state.user?
                    (<FlatButton label="Continue to app"/>)
                    :
                    (<FlatButton label="Get started"/>)
                  }
                </Link>
              </Col>
            </Row>
          </Grid>
        </Card>
      </div>
    );

  }
}

About.childContextTypes = {
  muiTheme: React.PropTypes.object
};
About.contextTypes = {
  history: PropTypes.history
}
export default About;

