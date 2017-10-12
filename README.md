Authors: Forrest Cinelli, Frank Egan, Tyle Jaskoviak, Holly Nguyen, Cory Tapply, Hope Wallace

### Summary

With our app called "FireVote", you can create, share, and vote in polls. This app uses a system of ranked choice ballots. This means that as the creator of a poll you can choose the number of winners you want to have. Anybody who votes in a poll is able to rank all of the options/answers that are provided. Based on the votes submitted and their ranking, you will be able to see the results of the poll, which will tell you which options won. 

### Description of Ranked Choice Ballot

Ranked choice voting or instant runoff voting is a system where voters can rank the candidates on a ballot instead of casting a single vote. This has several key benefits like removing the need for strategic voting where voters cast ballots for candidates of only big parties and not for candidates they actually agree with. When counting ballots winners are calculated by reaching a threshold then underperforming candidates are eliminated and their votes get transferred to the voter’s second choice candidate. This shows how the voter *would* have voted if their first choice hadn’t been running.

### How to use FireVote

The main home page explains the basics of the app and lets you click on the "Get Started" button to create a poll. In order to simply vote in a poll, the user must have a separate link which ends in “/vote/POLLID”. 

#### CREATE

Once at the create poll page, the user gets to set the poll title, an optional poll description, the number of winners for their poll, and the poll options that users can choose from. For the poll options, a user can add a description and also remove an option if they made a mistake. After all fields have been filled out to the user’s specification, they can click on "Create Poll". This then navigates the user to vote in the poll. 

#### VOTE

Any user with the link to a voting page can vote in a poll. On the left-hand side of the screen are the available options for a user to choose from. Clicking on the text of an option adds it to the ranked choices list on the right-hand side of the screen. Each item in the ranked choice list has "::" that lets you drag the option and rearrange your ranking. Users are not required to rank all items. Once a user’s ranking is complete, they can cast their vote by clicking on the “Cast” button. This will direct the user to the poll results page. 

#### RESULTS

This page shows the results of the poll (the winners and losers) so far based on the votes that have been cast and the number of winners that were chosen by the creator. If more users vote, you can refresh the page and the results will be updated. 

### Usage Example

Say you want to create a poll about what food to order for lunch. You can add all food options to your poll (sandwiches, coffee, tacos, breakfast pastries, etc.) and, for example, choose three winners. Other people can vote in the poll and rank their choices about which food they want to have. When the results are shown the winners will be the top three food choices based on the way people ranked the options. 
