export async function getAuditLogs(req, res) {
  try {
    const logSnapshot = await firestore.collection('audit_logs').get();

    if (logSnapshot.empty) {
      return res.status(404).send({ message: 'No logs found.' });
    }

    const logs = [];
    logSnapshot.forEach(doc => logs.push(doc.data()));

    res.status(200).send(logs);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}
