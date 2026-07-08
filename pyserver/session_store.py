import os, base64
class SessionStore:
    def __init__(self) -> None: #initialize our data
        self._sessionData = {}
        return
    def generateSessionId(self) -> str: #generate a large, random number for the session ID
        rnum = os.urandom(32)
        rstr = base64.b64encode(rnum).decode("utf-8")
        return rstr
    def createSession(self) -> str:
        sessionId = self.generateSessionId() #make a new session ID
        self._sessionData[sessionId] = {} #add a new session to the session store
        return sessionId
    def getSession(self, sessionId: str) -> dict | None: #retrieve an existing session from the session store
        if sessionId in self._sessionData:
            return self._sessionData[sessionId]
        else:
            return None