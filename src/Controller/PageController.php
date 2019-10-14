<?php

namespace App\Controller;

use App\Entity\Camp;
use App\Entity\Comment;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

class PageController extends AbstractController
{
    /**
     * @Route("/", name="root")
     * @param Request $request
     * @return Response
     */
    public function root(Request $request): Response
    {
        $locale = $request->getPreferredLanguage($this->getParameter('activated_locales'));

        return $this->redirectToRoute('index', ['_locale' => $locale]);
    }

    /**
     * @Route("/{_locale}", name="index", requirements={"_locale"="%locales_requirements%"})
     *
     * @return Response
     */
    public function index()
    {
        $repository = $this->getDoctrine()->getRepository(Camp::class);

        $camps = $repository->findBy(array(),array('id'=>'DESC'),4,0);

        $spotlight = $repository->findAll();
        if($spotlight) {
            return $this->render('page/index.html.twig',
                ['camps' => $camps,
                    'spotlight' => $spotlight[rand(0, count($spotlight) - 1)]]);
        } else {
            return $this->render('page/index.html.twig',
                ['camps' => $camps,
                    'spotlight' => $spotlight]);
        }
    }

    /**
     * @param $request
     *
     * @Route("/{_locale}/addCamp", name="addCamp", requirements={"_locale"="%locales_requirements%"})
     *
     * @return Response
     */
    public function addCamp(Request $request)
    {
        $camp = new Camp();
        $camp->setLikes(0);

        date_default_timezone_set('Europe/Brussels');

        $form = $this->createFormBuilder($camp)
            ->add('title', TextType::class)
            ->add('quote', TextType::class)
            ->add('date', DateType::class)
            ->add('image', TextType::class)
            ->add('intro', TextType::class)
            ->add('spotlight', CheckboxType::class)
            ->add('save', SubmitType::class, ['label' => 'Create Camp'])
            ->getForm();

        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            $data = $form->getData();

            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($data);
            $entityManager->flush();

            return $this->redirectToRoute("index");
        }

        return $this->render('page/addCamp.html.twig', [
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{_locale}/sportkampen", name="sportkampen", requirements={"_locale"="%locales_requirements%"})
     *
     * @return Response
     */
    public function sportkampen()
    {
        $repository = $this->getDoctrine()->getRepository(Camp::class);
        $camps = $repository->findAll();

        return $this->render('page/camps.html.twig', [
            'camps' => $camps,
        ]);
    }

    /**
     * @param $id
     *
     * @param Request $request
     * @param $_locale
     * @return Response
     * @throws \Exception
     * @Route("/{_locale}/sportkampen/{id}", name="sportkampDetail", requirements={"_locale"="%locales_requirements%"})
     *
     */
    public function sportkampDetail($id, Request $request, $_locale)
    {
        $repository = $this->getDoctrine()->getRepository(Camp::class);
        $camp = $repository->find($id);

        $comment = new Comment();
        $comment->setDate(new \DateTime());
        $comment->setCamp($camp);

        date_default_timezone_set('Europe/Brussels');

        $form = $this->createFormBuilder($comment)
            ->add('name', TextType::class)
            ->add('content', TextType::class)
            ->add('save', SubmitType::class, ['label' => 'Post Comment'])
            ->getForm();

        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            $data = $form->getData();

            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($data);
            $entityManager->flush();

            return $this->redirectToRoute('sportkampen', ['_locale' => $_locale, 'id' => $id]);
        }

        return $this->render('page/campDetail.html.twig', [
            'camp' => $camp,
            'form' => $form->createView()
        ]);
    }
}
