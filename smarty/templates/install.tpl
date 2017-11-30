<html>
	<head>
	{* installdb.php is in the root directory, so we know these relative
	   links should work. Load in the base LORIS bootstrap CSS
	*}
		<link rel="stylesheet" href="/bootstrap/css/bootstrap.min.css">
		<link rel="stylesheet" href="/bootstrap/css/custom-css.css">

		<title>Loris SQL Installer</title>
	</head>
    <body>
	<div class="container">
		<div class="page-header">
			<h1>LORIS Installer{if $PageName}: {$PageName}{/if}</h1>
		</div>
		{if $error}<div class="alert alert-danger error">{$error}</div>{/if}
		{if $console}<div class="alert alert-warning console"><pre>{$console}</pre></div>{/if}
		<div>
		{* Default page is at the end in the else statement. The rest of
		   the pages are in the order that the user goes through them *}
		{if $Page == "MySQLUserPrompt"}
			<p>
			   Successfully created MySQL database and sourced the schema.
			   Now, we need to create a non-administer MySQL username for LORIS to use.
			   This user will be created if it does not already exist.
			</p>
			<p>
			   This username and password will be saved to the LORIS config
			   file, so it's best to make sure you're using a unique password.
			</p>
			<p>
			   If you're feeling uninspired, here's a randomly generated password:
				<code>{$SamplePassword}</code>.
			</p>
		<form method="post">
			<fieldset>
				<legend>LORIS MySQL User</legend>
			<div>
				<label for="lorismysqluser">Username: <input type="text" name="lorismysqluser" placeholder="ie. lorisuser" value="{$lorismysqluser}">
			</div>
			<div>
				<label for="lorismysqlpassword">Password: <input type="password" value="{$lorismysqlpassword}" name="lorismysqlpassword" placeholder="ie. LORISISTHEBEST!!!1">
			</div>
			<div>
				<label for="lorismysql_already_created">Already Created:
                <input type="checkbox" name="lorismysql_already_created" value="on" {($lorismysql_already_created == 'on') ? 'checked' : ''}/>
			</div>
			</fieldset>
            <div>
                Check "<strong>Already Created</strong>" only if the appropriate mysql user has already been created!<br/>
                If you or the web admin wish to give the appropriate privileges to an existing MySQL user, <br/>
                the privileges are <code>SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, REFERENCES, CREATE TEMPORARY TABLES, LOCK TABLES</code><br/>
                for the following: <code>`{$dbname}`.*</code>
            </div>
            <hr/>
			<p>
			   We also need to set the username and password for the default
			   <em>LORIS</em> admin account. This is the account that you will
			   use to login to the LORIS frontend. Here's another password that
			   you can user for that account if you don't have something else
			   in mind: <code>{$SamplePassword2}</code>.
			</p>
			<fieldset>
				<legend>LORIS Front End Admin</legend>
			<div>
				<label for="frontenduser">Username: <input type="text" name="frontenduser" placeholder="ie. myname" value="{$frontenduser}">
			</div>
			<div>
				<label for="frontendpassword">Password: <input type="password" name="frontendpassword" placeholder="ie. LORISISSTILLTHEBEST!!1" value="{$frontendpassword}">
			</div>
			</fieldset>
			<input type="hidden" name="formname"        value="createmysqlaccount" />
			<input type="hidden" name="dbname"          value="{$dbname}" />
			<input type="hidden" name="dbhost"          value="{$dbhost}" />
			<input type="hidden" name="dbadminuser"     value="{$dbadminuser}" />
			<input type="hidden" name="dbadminpassword" value="{$dbadminpassword}" />
			<div>
				<input type="submit" />
			</div>
		</form>
	{elseif $Page == "Done"}
		{if $configfile}
			<h2>Congratulations! You're done</h2>
			<p>Wrote LORIS config file to {$configfile}.</p>
		{else}
			<h2>Almost done!</h2>
			<p>The LORIS username was configured, but the web server
			   wasn't able to write to the file {$configlocation}.</p>
			<p>Please copy and paste the following into that file
			   on the server in which this web server is running or
			   contact your system administer for help:</p>
			<div>
				<code><pre>{$configcontent}</pre></code>
			</div>
		{/if}
			<p>
			  {if $configfile}
				You should now be able to
			  {else}
				After that you should be able to
			  {/if} access LORIS by visiting
			  <a href="{$lorisurl}">{$lorisurl}</a> and logging in
			  with the front end admin username and password you
			  configured on the previous page.
			</p>
	{else}
		{* Default Page *}
		<p>Welcome to the LORIS installer.</p>
		<p>This module is the last step in installing LORIS, before
		proceeding to do your study configuration.</p>
		<p>This installer will set up the default users, create the SQL
		database and load the LORIS database schema, set up some basic
		server configuration, and reset the default LORIS username and
		password.
		<p>In order to proceed you'll need the following information:
		<ul>
			<li>A MySQL hostname that you'll be installing
			    LORIS on, which is accessible from this server.</li>
			<li>A MySQL root username and password on that server which
			    has permissions to create databases, tables, and users
			    (this username and password will not be saved, but is
			    only used for installing LORIS.)</li>
			<li>The database name for LORIS to use. It's best to name
			    your databases after the project being hosted, but if
			    you're unsure it's safe to use the default value of
			    "LORIS". This database must <strong>not</strong> already
			    exist in MySQL.</li>
		</ul></p>
		<p>Let's get started.</p>
		<form method="post">
			<fieldset>
				<legend>MySQL Connection Information</legend>
			<div>
				<div class="col-md-2">
					<label for="serverhost">Server Hostname:</label>
				</div>
				<div class="col-md-10">
					<input id="serverhost" value="{$dbhost}" type="text" name="dbhost" placeholder="ie. localhost">
				</div>
			</div>
			<div>
				<div class="col-md-2">
					<label for="serveruser">Admin Username:</label>
				</div>
				<div class="col-md-10">
					<input id="serveruser" value="{$dbadminuser}" name="dbadminuser" type="text" placeholder="ie. root">
				</div>
                <div>
                    The admin should have <strong>ALL</strong> privileges granted for the database specified.
                </div>
			</div>
			<div>
				<div class="col-md-2">
					<label for="serverpassword">Admin Password:</label>
				</div>
				<div class="col-md-10">
					<input id="serverpassword" value="{$dbadminpassword}" type="password" name="dbadminpassword" placeholder="ie. LORISISTHEBEST!!!1">
				</div>
			</div>
			<div>
				<div class="col-md-2">
					<label for="dbname">Database name:</label>
				</div>
				<div class="col-md-10">
					<input id="dbname" value="{if $dbname}{$dbname}{else}LORIS{/if}" type="text" name="dbname">
				</div>
			</div>
            <hr/>
			<div>
				<div class="col-md-2">
					<label for="use_existing_database">Use Existing Database:</label>
				</div>
				<div class="col-md-9">
					<input type="checkbox" id="use_existing_database" name="use_existing_database" value="on" {($use_existing_database == 'on') ? 'checked' : ''}/>
                    Check this if the database already exists but does not have Loris installed yet
                    <!--The following is a hack to get the UI to align correctly *shrug*-->
                    <div style="height:10px;">&nbsp;</div>
				</div>
			</div>
			<div>
				<div class="col-md-2">
					<label for="do_not_install">Do Not Install:</label>
				</div>
				<div class="col-md-10">
					<input type="checkbox" id="do_not_install" name="do_not_install" value="on" {($do_not_install == 'on') ? 'checked' : ''}/>
                    Check this if you already installed Loris at the specified database
                    <!--The following is a hack to get the UI to align correctly *shrug*-->
                    <div style="height:10px;">&nbsp;</div>
				</div>
			</div>
			<div>
				<div class="col-md-2">
					<label for="do_not_update_config">Do Not Update Configuration:</label>
				</div>
				<div class="col-md-10">
					<input type="checkbox" id="do_not_update_config" name="do_not_update_config" value="on" {($do_not_update_config == 'on') ? 'checked' : ''}/>
                    Check this if you don't want to update the configuration.
                    <em>(You really should update the configuration if possible, though)</em>
                    <!--The following is a hack to get the UI to align correctly *shrug*-->
                    <div style="height:10px;">&nbsp;</div>
				</div>
			</div>
			</fieldset>
			<input type="hidden" name="formname" value="validaterootaccount" />
			<div class="col-md-2">&nbsp;</div>
			<div class="col-md-10">
				<input class="btn btn-submit btn-default" type="submit" />
			</div>
		</form>
	{/if}
    </div>
	</div>
    </body>
</html>
