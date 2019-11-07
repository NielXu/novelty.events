# Novelty.Events
This is a platform for handling events in Novelty UTSC. It contains two parts, members and admins. Members can checkout what and when is the next event, suggest an event or browse the photos of the past events. Admins can add or update members, setting up the upcoming events or upload photos.

# Member features
- [ ] Login/Logout
- [ ] Activate (Members must have an Novelty card)
- [ ] Reminder for the next event (Time, location, theme, etc.)
- [ ] Browse past events
- [ ] Suggest an event
- [ ] Get an QRCode for each event for checkin purpose
- [ ] Chat with others?

# Admin features
- [ ] Login/Logout
- [ ] Add an new event
- [ ] Text message/email reminder for the upcoming events
- [ ] Upload photos to gallary
- [ ] View members suggestions (May be able to respond)
- [ ] Chat with others?

# Dev
This project mainly using Express as the backend and React as the frontend. It uses the GraphQL library as the API controller, which is fast and handy. First setup the local database for development
```sh
./startdb.sh
```
Then start the server:
```sh
npm start
```
And now you can go to the [GraphiQL](localhost:4000/graphql) to start testing the API using GraphQL.
To insert a member for testing:
```
mutation {
  addMember(input: {
    firstname: "firstname",
    lastname: "lastname",
    username: "username",
    password: "password",
    email: "email",
    school: UTSC
  }) {
    username,
    password
  }
}
```
To insert an admin for testing
```
mutation {
  addAdmin(input: {
    firstname: "firstname",
    lastname: "lastname",
    username: "username",
    password: "password",
    email: "email"
  }) {
    username,
    password
  }
}
```