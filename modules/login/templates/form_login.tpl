<div class="container">
  <div class="row">
    <section class="col-md-4 col-md-push-8">
      <div class="panel panel-default login-panel">
        <div class="panel-heading">
          <h3 class="panel-title">Login to LORIS</h3>
        </div>
        <div class="panel-body">
          {if $study_logo}
            <section class="study-logo">
              <img src="{$baseurl}/{$study_logo}" alt="{$study_title}"/>
            </section>
          {/if}
          <form method="POST" action="{$action}">
            <div class="form-group">
              <input type="text" name="username" class="form-control" placeholder="Username" value="{$username}"/>
            </div>
            <div class="form-group">
              <input type="password" name="password" class="form-control" placeholder="Password" aria-describedby="helpBlock" />
              {if $error_message}
                <span id="helpBlock" class="help-block">
                    <b class="text-danger">{$error_message}</b>
                </span>
              {/if}
            </div>
            <div class="form-group">
                <input type="checkbox" name="tpaccept" value="accepted"> I accept the <a href="#" data-toggle="modal" data-target="#tModal">terms</a> and <a href="#" data-toggle="modal" data-target="#pModal">publication policy</a>.
            </div>
            <div class="form-group">
              <input type="submit" name="login" class="btn btn-primary btn-block" value="Login" />
            </div>
          </form>
          <div class="help-links">
            <a href="{$baseurl}/login/password-reset/">Forgot your password?</a><br/>
            <a href="{$baseurl}/login/request-account/">Request Account</a>
          </div>
          <div class="help-text">
            A WebGL-compatible browser is required for full functionality (Mozilla Firefox, Google Chrome)
          </div>
        </div>
      </div>
    </section>
    <section class="col-md-8 col-md-pull-4">
      <div class="panel panel-default study-panel">
        <div class="panel-heading">
          <h3 class="panel-title">{$study_title}</h3>
        </div>
        <div class="panel-body">
          <section class="study-description">
            <p>{$study_description}</p>
          </section>
        </div>
      </div>
    </section>
  </div>
</div>


<div class="modal fade" id="tModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content" style="border-radius: 7px">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                <h3 class="modal-title" id="myModalLabel">Terms</h3>
            </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-xs-12 form-group">
terms
                        </div>
                    </div>
                </div>
        </div>
    </div>
</div>

<div class="modal fade" id="pModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content" style="border-radius: 7px">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                <h3 class="modal-title" id="myModalLabel">Publication Policy</h3>
            </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-xs-12 form-group">
<div class="policy">
  <ul>
   <li> If I publish abstracts using data from PREVENT-AD, I agree to the following:</li>
  </ul>
  <i>"I will cite PREVENT-AD as the source of data in the abstract if space allows"</i>
  <p></p>
  <ul> 
    <li>If I publish manuscripts using data from PREVENT-AD, I agree to the following:</li> 
  </ul>  
  <i>"I will state the source of data and cite the primary publication of PREVENT-AD in the methods section of my manuscripts by including language similar to the following: 'Data used in preparation of this article were obtained from the Pre-symptomatic Evaluation of Novel or Experimental Treatments for Alzheimer's Disease (PREVENT-AD) program. (Breitner et al., 2016)'."</i>
</div>
                        </div>
                    </div>
                </div>
        </div>
    </div>
</div>
