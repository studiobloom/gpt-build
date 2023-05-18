Visit https://astrolo-gpt.com for the live site.  
This is a Webflow clone that's a part of a guide/template I made for creating a Web Application using Webflow as the designer, and building a Node.js app while hosting it all from AWS servers.
You can use this clone or even modify your own design and follow my guide to get it all set up. You will be required to export the Webflow build so keep that in mind.


## Webflow Setup ##

IF using the astrolo-gpt Template (https://webflow.com/made-in-webflow/website/astrolo-gpt) follow the comments inside of the before </body> Custom Code. 
   - If you wish to add/modify fields then please view steps 2-4 below.

If Modifying a Webflow build that is NOT the Astrolo-gpt Template:

1. Open the Webflow_Custom_Code.md file inside of /gpt-build/web and copy paste it into your Webflow's before </body> custom code box
2. Create/Modify your Webflow site's form to have the correct name attributes for each field name as expected by the API endpoint. 
   In the provided code, the field names are {name}, {location}, {birthdate}, and {question}. If you modify or add form fields, you must update 
   the corresponding field name ID's on the Webflow component(s), the custom code added to webflow, as well as the index.js code.
3. Change both your Form and Statement settings Action Field to: https://your-domain.com/api and ensure Method is set to POST.
4. Make sure that the result elements (#statement-component, #statement-loader, and #statement-text) exist in your Webflow site. 
   These elements are used to display the response from the server. You can customize the styling and layout of these elements to 
   match your design preferences.

Once your Webflow build is modified correctly, export it out of Webflow to the /gpt-build/web/ folder. 
(Your Webflow site does not function at this point)

## AWS Setup ##

First and foremost you must create an AWS account and connect your personal and payment details to overlord bezos.

# EC2 Instance #

EC2 Instances are Virtual Machines you pay hourly for, we will be using the cheapest tier which runs things with barely any utilization
I almost wish there were lower tiers...

1A. Prior to setting things up on your Virtual Machine (which can be very slow to use) you may want to skip
   to complete ONLY Step 1. of ## Server Setup on your local machine prior to moving the build over to AWS
1. Sign in to the AWS Management Console and go to the EC2 Dashboard. Click on "Launch Instance" and choose Windows AMI
2. Select the 't3.nano' instance type. This is the cheapest tier, be patient with the weak virtual machine, you are saving money:)
3. Allow all incoming traffic by selecting "All traffic" in the "Security groups" settings.
4. Review the instance configuration and click "Launch" to start the instance. Choose the option to create a new key pair. 
   Enter a name for the key pair, then click "Download Key Pair". This will download a .pem file, which will be used for SSH access.

# Elastic IP #

EC2 Instances have their IP changed when restarted, enabling Elastic IP for a small upcharge ensures our IP stays the same which allows
us to reliably serve our site/web app.

1. In the EC2 Dashboard, navigate to "Elastic IPs" in the left navigation panel.
2. Click "Allocate new address" and choose the option for "Amazon's pool of IPv4 addresses".
3. Select the newly allocated Elastic IP address from the list. Click "Actions" > "Associate IP address".
4. Choose the instance you launched earlier from the drop-down list and click "Associate".
5. Back at your EC2 Dashboard, select the intance and click Actions > Get Windows Password > Select key pair file from setup > Copy User + Pass

## Connecting to the Matri... I mean Virtual Machine ##

Personally I just use Windows Remote Desktop Connection but any SSH software will work.
You just enter the Elastic IP address of the instance in the "Computer" field click connect and enter the username and password you copied before.

## Server Setup ##

The server uses node.js, express.js, and greenlock for SSL/TLS certificates. The index.js file is where you'll 'flavor' your Chat-GPT

1. Copy/Paste the entire gpt-build folder from your local machine to the virtual cloud machine.
2. Edit the `index.js` file following the comments to modify the code according to your needs.
3. Open command prompt/terminal from inside the server folder and run `npm install` to install the necessary Node.js packages.
4. Edit the `.env` file and add your OpenAI API key like so: `API_KEY=your_openai_api_key`
5. Setup `greenlock-express` for SSL/TLS certificates:

   - Create a `.greenlockrc` file in the server directory. The file should look like this:


    ```json
    {
        "packageRoot": ".",
        "configDir": "./greenlock.d",
        "maintainerEmail": "your-email@example.com",
        "cluster": false
    }
    ```

   Replace `"your-email@example.com"` with your email address.

   - Create a `greenlock.d` directory in the server directory. 
   - Inside the `greenlock.d` directory, create a `config.json` file. 
   - This file should contain your domain information in the following format:


    ```json
    {
        "sites": [
            {
                "subject": "www.yourdomain.com",
                "altnames": ["www.yourdomain.com"],
                "contacts": ["mailto:your-email@example.com"]
            }
        ]
    }
    ```
6. Modify and run the following command in the server folder to obtain the SSL/TLS certificates:
./node_modules/greenlock-express/acme.js --config-dir ./greenlock.d --maintainer-email YOUR-EMAIL@EMAIL.COM --agree-to-terms
7. Once the certificate generation process is complete (this can take a bit sometimes), follow the instructions in the email to verify your domain ownership. 
   Once the verification is complete, the SSL/TLS certificates will be generated successfully and your site will now serve securely from https://

## Running the Server ##

Open server.bat to run the server and boom you are live!