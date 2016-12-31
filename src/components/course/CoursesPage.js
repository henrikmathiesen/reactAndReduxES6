import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, FormControl } from 'react-bootstrap';
import * as courseActions from '../../actions/courseActions';

class CoursePage extends Component {

    // Call super(props) only if you want to access this.props inside the constructor. React automatically set it for you if you want to access it anywhere else.
    // http://cheng.logdown.com/posts/2016/03/26/683329 , http://stackoverflow.com/questions/30571875/whats-the-difference-between-super-and-superprops-in-react-when-using-e
    constructor(props, context) {
        super(props, context);

        this.state = {
            course: {
                title: ''
            }
        };

        // Place these in the constructor and not in the render method, for performance reasons
        this.changeCourse = this.changeCourse.bind(this);
        this.onTitleChange = this.onTitleChange.bind(this);
        this.onClickSave = this.onClickSave.bind(this);
    }

    changeCourse(title) {
        const course = this.state.course;
        course.title = title;
        this.setState({ course: course });
    }

    onTitleChange(event) {
        const title = event.target.value;
        this.changeCourse(title);
    }

    onClickSave() {
        if (!this.state.course.title) { return; }
        console.log(`Saving course: ${this.state.course.title}`);
        //this.props.dispatch(courseActions.createCourse(this.state.course)); // A
        //this.props.createCourse(this.state.course); // B1
        this.props.actions.createCourse(this.state.course); // B2
        this.changeCourse('');
    }

    render() {
        const buttonBsStyle = this.state.course.title ? 'success' : 'warning';

        return (
            <div className="row">
                <div className="col-md-8">
                    <div className="row">
                        <div className="col-xs-12">
                            <h1>Courses</h1>
                            {this.props.courses.map((course, index) => <div key={index}>{course.title}</div>)}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12">
                            <h2>Add Course</h2>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-9 col-sm-8">
                            <FormControl
                                type="text"
                                value={this.state.course.title}
                                placeholder="Course name"
                                onChange={this.onTitleChange} />
                        </div>
                        <div className="col-xs-3 col-sm-4">
                            <Button
                                block
                                bsStyle={buttonBsStyle}
                                onClick={this.onClickSave}>
                                Add
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

CoursePage.propTypes = {
    //dispatch: PropTypes.func.isRequired, -- no longer injected since we use aproach B
    courses: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
};

// Set the properties that are exposed on our component (that can be accessed above, with this.props.courses). ownProps are this components props in case we need to access those here
function mapStateToProps(state, ownProps) {
    return {
        courses: state.courseReducer
    };
}

// Used instead of dispatching manually above (A), instead uses B
function mapDispatchToProps(dispatch) {
    return {
        //createCourse: course => dispatch(courseActions.createCourse(course)) B1
        actions: bindActionCreators(courseActions, dispatch) // B2 convinient method that looks through all actions and wrap them in a call to dispatch
    };
}

// Omitting mapDispatchToProps (what actions to expose on our component) as second argument means that our component gets a dispatch property attached to it (this.props.dispatch(), A)
export default connect(mapStateToProps, mapDispatchToProps)(CoursePage);
