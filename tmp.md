Software Requirements Specification
for
<Project>
Version 1.0 approved
Prepared by <author>
<organization>
<date created>
 
Table of Contents
Table of Contents	ii
Revision History	ii
1.	Introduction	1
1.1	Purpose	1
1.2	Document Conventions	1
1.3	Intended Audience and Reading Suggestions	1
1.4	Product Scope	1
1.5	References	1
2.	Overall Description	2
2.1	Product Perspective	2
2.2	Product Functions	2
2.3	User Classes and Characteristics	2
2.4	Operating Environment	2
2.5	Design and Implementation Constraints	2
2.6	User Documentation	2
2.7	Assumptions and Dependencies	3
3.	External Interface Requirements	3
3.1	User Interfaces	3
3.2	Hardware Interfaces	3
3.3	Software Interfaces	3
3.4	Communications Interfaces	3
4.	System Features	4
4.1	System Feature 1	4
4.2	System Feature 2 (and so on)	4
5.	Other Nonfunctional Requirements	4
5.1	Performance Requirements	4
5.2	Safety Requirements	5
5.3	Security Requirements	5
5.4	Software Quality Attributes	5
5.5	Business Rules	5
6.	Other Requirements	5
Appendix A: Glossary	5
Appendix B: Analysis Models	5
Appendix C: To Be Determined List	6


Revision History
Name	Date	Reason For Changes	Version
			
			


 
1.	Introduction
1.1	Purpose 
In this SRS, we describe the requirements for the first version of a platform called GreenGrant, which is used to create, list and review grants and apply to them. The SRS contains the requirements for the entire system.
1.2	Document Conventions
-
1.3	Intended Audience and Reading Suggestions
This SRS may be interesting and useful for any employee involved in the project, regardless of their technical knowledge.
1.4	Product Scope
In addition to digital transformation, the ZDR program also supports the country’s sustainability goals. A key component of this is an online support portal through which individuals and businesses can apply for government subsidies for green investments.
1.5	References
The case study on which the system is based can be found at the following link:
•	02: GreenGrant

2.	Overall Description
2.1	Product Perspective
GreenGrant is a new greenfield project with no history whatsoever.





2.2	Product Functions
GreenGrant provides the following functionalities to the users:

Applicant facing(Web Site):
-	Listing/Searching currently available grants 
-	Applying to currently available grants
-	notification by MundaMail

Public Administration facing(Web Site):
-	Creating new grants
-	Review and evaluate grant applications
-	AI (GF) helper tool

System Administrator facing(Web Site):
-	Manage users
-	Manage other UIs
2.3	User Classes and Characteristics
-	All citizens of Zamunda (approximately 10 million people)
-	Businesses operating in Zamunda (approximately 1 million businesses)
-	Administrators in the Zamunda public administration
-	System administrators

2.4	Operating Environment

-	Data processed by the system must be stored within Zamunda’s territory, and the system must be operated within Zamunda’s territory.

2.5	Design and Implementation Constraints
-	Uses MundaMail API for notifications.
-	The whole system must be operated within Zamunda’s territory.

2.6	User Documentation
-
2.7	Assumptions and Dependencies

-	Applicants must be notified of the outcome of the evaluation through MundaMail API

3.	External Interface Requirements
3.1	User Interfaces

The system provides the following user interfaces:
-	Web interface
o	compatible with mobile and desktop usage 
o	contains different views for each different  role
o	integrated AI tool

3.2	Hardware Interfaces
-
3.3	Software Interfaces
The supported operating system, data storage solutions, technologies, libraries and frameworks are currently unspecified.

Other software interfaces:
-	the notifications system implements and is dependent on MundaMail™ API.
3.4	Communications Interfaces
-	for the web interface HTTPS
-	SFTP for document uploads
-	Notifications email through MundaMail
4.	System Features

4.1	Listing/Searching currently available grants 

    4.1.1	Description and Priority
        High Priority

        Provides a search and filter function to easily navifgate among published grants.
        
    4.1.2	Stimulus/Response Sequences
        As a response to the "Search" button pressed by the user, the system shows the list of published grants, based on the search and filter options provided by the user. 
    4.1.3	Functional Requirements
        F-LG-01
        The system search implements a fuzzy finder opn grants names and description.    
        F-LG-02
        The system provides a filtration option, based on the following parameters: 
        -   start date
        -   end date
        -   end of evaluation date
        -   category
        -   target audience
        -   ammount of money

4.2	Applying to currently available grants
    4.2.1	Description and Priority
        High Priority

        Provides the option to apply to a selected grant.

    4.2.2	Stimulus/Response Sequences
        The user provides the required documentation and information for the application, and the system validates and in case of validity records the application, by storing all of its info. and doc..

    4.2.3	Functional Requirements
        F-AG-01
            The system is able to accept text and file input through a form.
        F-AG-02
            The system is able validate all forms of input, based on size, content, metadata and others.
        F-AG-03
            The system is able to securely store all provided and validated input and user data.


4.3 notification by MundaMail

    4.1.1	Description and Priority

    4.1.2	Stimulus/Response Sequences

    4.1.3	Functional Requirements

4.4 Creating new grants

    4.1.1	Description and Priority

    4.1.2	Stimulus/Response Sequences

    4.1.3	Functional Requirements

4.5 Review and evaluate grant applications

    4.1.1	Description and Priority

    4.1.2	Stimulus/Response Sequences

    4.1.3	Functional Requirements

4.6 AI (GF) helper tool
    4.1.1	Description and Priority

    4.1.2	Stimulus/Response Sequences

    4.1.3	Functional Requirements

4.7 Manage users
    4.1.1	Description and Priority

    4.1.2	Stimulus/Response Sequences

    4.1.3	Functional Requirements

4.8 Manage other UIs
    4.1.1	Description and Priority

    4.1.2	Stimulus/Response Sequences

    4.1.3	Functional Requirements

5.	Other Nonfunctional Requirements
5.1	Performance Requirements
NF-AG-01
    The processing time of applications must be p99 500ms from submission to storage of crucial data in the GreenGrant database.

    The processing process consits of client side input validation, and crucial data transfer to the server. The files and other forms of high volume data, are to be transferred and stored in an asynchronous way.

NF-AH-01
    The AI helper tool should ensure the p90 response time is under 20 seconds, measured from the moment a user submits a prompt to the moment the complete response is rendered to the user's client.


5.2	Safety Requirements
<Specify those requirements that are concerned with possible loss, damage, or harm that could result from the use of the product. Define any safeguards or actions that must be taken, as well as actions that must be prevented. Refer to any external policies or regulations that state safety issues that affect the product’s design or use. Define any safety certifications that must be satisfied.>
5.3	Security Requirements
<Specify any requirements regarding security or privacy issues surrounding use of the product or protection of the data used or created by the product. Define any user identity authentication requirements. Refer to any external policies or regulations containing security issues that affect the product. Define any security or privacy certifications that must be satisfied.>
5.4	Software Quality Attributes
<Specify any additional quality characteristics for the product that will be important to either the customers or the developers. Some to consider are: adaptability, availability, correctness, flexibility, interoperability, maintainability, portability, reliability, reusability, robustness, testability, and usability. Write these to be specific, quantitative, and verifiable when possible. At the least, clarify the relative preferences for various attributes, such as ease of use over ease of learning.>
5.5	Business Rules
<List any operating principles about the product, such as which individuals or roles can perform which functions under specific circumstances. These are not functional requirements in themselves, but they may imply certain functional requirements to enforce the rules.>
6.	Other Requirements
<Define any other requirements not covered elsewhere in the SRS. This might include database requirements, internationalization requirements, legal requirements, reuse objectives for the project, and so on. Add any new sections that are pertinent to the project.>
Appendix A: Glossary
<Define all the terms necessary to properly interpret the SRS, including acronyms and abbreviations. You may wish to build a separate glossary that spans multiple projects or the entire organization, and just include terms specific to a single project in each SRS.>
Appendix B: Analysis Models
<Optionally, include any pertinent analysis models, such as data flow diagrams, class diagrams, state-transition diagrams, or entity-relationship diagrams.>
Appendix C: To Be Determined List
<Collect a numbered list of the TBD (to be determined) references that remain in the SRS so they can be tracked to closure.>
