var Contribution = React.createClass({
  render: function(){
    return(
      <div className="mb2 border-bottom">
        <div className="userName">
          {this.props.contribution.user.first_name} {this.props.contribution.user.last_name}
        </div>
        <div className="contributionBody">{this.props.contribution.body}</div>
        <div className="contributionJustification">{this.props.contribution.justification}</div>
        <a className="blue button button-outline button-small mb1" href="/users/sign_in" title="Concordar">
          <span className="border-blue border-right px1">Concordar</span>
          <span className="px1">
            <i className="fa fa-thumbs-o-up mr1" />
            0
          </span>
        </a>
      </div>
    );
  }
});
