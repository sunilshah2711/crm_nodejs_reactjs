import express from 'express'
const router = express.Router()
import { userRoute } from './user'
import { googleRoute } from './google'
import { salesforceRoute } from './salesforce'
import { workspaceRoute } from './workspace'
import { contactRoute } from './contact'
import { listRoute } from './list'
import { emailTemplateRoute } from './email_templates'
import { senderRoute } from './sender'
import { campaignRoute } from './campaigns'
import { mediaRoute } from './media'
import { projectCategoryRoute } from './projects_categories'
import { projectRoute } from './projects';
import { filterRoute } from './filter'

router.use(googleRoute)
router.use(salesforceRoute)
router.use(userRoute)
router.use(workspaceRoute)
router.use(contactRoute)
router.use(listRoute)
router.use(emailTemplateRoute)
router.use(senderRoute)
router.use(campaignRoute)
router.use(mediaRoute)
router.use(projectCategoryRoute)
router.use(projectRoute)
router.use(filterRoute)
export { router }