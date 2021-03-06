var ContributionForm = React.createClass({
  getInitialState: function() {
    return {
      contributionBody: this.props.paragraph.body.replace(/<(?:.|\n)*?>/gm, ''),
      contributionJustification: "",
      isBodyValid: true,
      isJustificationValid: true,
      isLoading: false,
      focusOn: null
    };
  },

  componentWillUpdate: function(nextProps, nextState) {
    if(!this.props.isFormOpen && nextProps.isFormOpen) {
      this.setState({
        contributionBody: this.getInitialState().contributionBody,
        contributionJustification: "",
        focusOn: "contributionBody"
      });
    }

    if(this.state.newContribution == null && nextState.newContribution != null){
      this.setState({isLoading: nextState.newContribution.paragraph_hash == this.props.paragraphHash});
    } else if(this.state.newContribution != null && nextState.newContribution == null){
      this.setState({isLoading: false});
    }
  },

  componentDidUpdate: function() {
    if(this.props.isFormOpen) {
      this.resizeTextarea(this.refs.contributionBody);
      this.resizeTextarea(this.refs.contributionJustification);

      if(this.state.focusOn == "contributionBody") {
        React.findDOMNode(this.refs.contributionBody).focus();
        this.setState({focusOn: null});
      } else if (this.state.focusOn == "contributionJustification") {
        React.findDOMNode(this.refs.contributionJustification).focus();
        this.setState({focusOn: null});
      }
    }
  },

  resizeTextarea: function(textarea) {
    e = React.findDOMNode(textarea);
    e.style.height = 0;
    e.style.height = e.scrollHeight + 2 + "px";
  },

  submitForm: function(){
    isBodyValid = true;
    isJustificationValid = true;
    focusOn = null;

    if(this.state.contributionJustification == "") {
      isJustificationValid = false;
      focusOn = "contributionJustification";
    }

    if(this.state.contributionBody == "") {
      isBodyValid = false;
      focusOn = "contributionBody";
    }

    if(isBodyValid && isJustificationValid) {
      this.getFlux().actions.createContribution({
        body: this.state.contributionBody,
        justification: this.state.contributionJustification,
        document_id: this.props.document.id,
        paragraph_hash: this.props.paragraphHash
      }, this.props.currentUser.api_token);
    }

    this.setState({
      isBodyValid: isBodyValid,
      isJustificationValid: isJustificationValid,
      focusOn: focusOn
    });
  },

  render: function() {
    bodyClass = "block full-width field-light mb2";
    if(!this.state.isBodyValid){
      bodyClass = bodyClass + " is-error";
    }

    justificationClass = "block full-width field-light";
    if(!this.state.isJustificationValid){
      justificationClass = justificationClass + " is-error";
    }

    bodyId = "contribution_body_" + this.props.paragraphHash;
    justificationId = "justification_body_" + this.props.paragraphHash;

    if(this.props.currentUser != null) {
      return <form
        className="newContributionForm clearfix p2 rounded bg-darken-1"
        onSubmit={this.onSubmit}>
        <label
          className="h5"
          htmlFor={bodyId}>Contribua com a sua versão para este parágrafo</label>
        <textarea
          className={bodyClass}
          name="contribution[body]"
          id={bodyId}
          ref="contributionBody"
          value={this.state.contributionBody}
          onChange={this.onContributionBodyChange}
          style={{resize: "none"}}>
        </textarea>
        <label
          className="h5"
          htmlFor={justificationId}>Justifique a sua contribuição</label>
        <div className="mb2">
          <textarea
            className={justificationClass}
            name="contribution[justification]"
            id={justificationId}
            ref="contributionJustification"
            value={this.state.contributionJustification}
            onChange={this.onContributionJustificationChange}
            style={{resize: "none"}}>
          </textarea>
          <small
            className="red"
            style={{display: this.state.isJustificationValid ? 'none' : 'inline'}}>
            Para validar sua contribuição é preciso justificá-la
          </small>
        </div>
        <button className="button right" disabled={this.state.isLoading}>
          <i
            className="fa fa-refresh fa-spin mr1"
            style={{
              opacity: ".5",
              display: this.state.isLoading ? "inline" : "none"}}/>
          Enviar
        </button>
      </form>;
    } else {
      return <div className="center p2 rounded bg-darken-1">
        <div className= "h1 mb1 blue muted">
          <i
            className="fa fa-user"
            style={{fontSize: "5em"}}/>
        </div>
        <a
          className="button"
          href="/users/sign_in">
          Registre-se ou faça login para colaborar com esse edital
        </a>
      </div>
    }
  },

  // Callbacks
  onContributionBodyChange: function(e) {
    this.setState({contributionBody: e.target.value});
    this.resizeTextarea(this.refs.contributionBody);
  },

  onContributionJustificationChange: function(e) {
    this.setState({contributionJustification: e.target.value});
    this.resizeTextarea(this.refs.contributionJustification);
  },

  onSubmit: function(e) {
    e.preventDefault();
    this.submitForm();
  },

  // Fluxxor stuff
  mixins: [Fluxxor.FluxMixin(React), Fluxxor.StoreWatchMixin("DocumentStore")],

  getStateFromFlux: function() {
    var flux = this.getFlux();
    return flux.store("DocumentStore").getState();
  }
});
